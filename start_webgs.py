#!/usr/bin/env python3

#
# Author: Andrew Peters
#
# Copyright 2019 United States Government as represented by the Administrator of the National Aeronautics
# and Space Administration. All Rights Reserved.
#  
# Disclaimers
# No Warranty: THE SUBJECT SOFTWARE IS PROVIDED "AS IS" WITHOUT ANY WARRANTY OF ANY
# KIND, EITHER EXPRESSED, IMPLIED, OR STATUTORY, INCLUDING, BUT NOT LIMITED TO, ANY
# WARRANTY THAT THE SUBJECT SOFTWARE WILL CONFORM TO SPECIFICATIONS, ANY IMPLIED
# WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, OR FREEDOM FROM
# INFRINGEMENT, ANY WARRANTY THAT THE SUBJECT SOFTWARE WILL BE ERROR FREE, OR ANY
# WARRANTY THAT DOCUMENTATION, IF PROVIDED, WILL CONFORM TO THE SUBJECT SOFTWARE.
# THIS AGREEMENT DOES NOT, IN ANY MANNER, CONSTITUTE AN ENDORSEMENT BY GOVERNMENT
# AGENCY OR ANY PRIOR RECIPIENT OF ANY RESULTS, RESULTING DESIGNS, HARDWARE,
# SOFTWARE PRODUCTS OR ANY OTHER APPLICATIONS RESULTING FROM USE OF THE SUBJECT
# SOFTWARE.  FURTHER, GOVERNMENT AGENCY DISCLAIMS ALL WARRANTIES AND LIABILITIES
# REGARDING THIRD-PARTY SOFTWARE, IF PRESENT IN THE ORIGINAL SOFTWARE, AND
# DISTRIBUTES IT "AS IS."
#  
# Waiver and Indemnity:  RECIPIENT AGREES TO WAIVE ANY AND ALL CLAIMS AGAINST THE UNITED
# STATES GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS ANY PRIOR
# RECIPIENT.  IF RECIPIENT'S USE OF THE SUBJECT SOFTWARE RESULTS IN ANY LIABILITIES,
# DEMANDS, DAMAGES, EXPENSES OR LOSSES ARISING FROM SUCH USE, INCLUDING ANY
# DAMAGES FROM PRODUCTS BASED ON, OR RESULTING FROM, RECIPIENT'S USE OF THE SUBJECT
# SOFTWARE, RECIPIENT SHALL INDEMNIFY AND HOLD HARMLESS THE UNITED STATES
# GOVERNMENT, ITS CONTRACTORS AND SUBCONTRACTORS, AS WELL AS ANY PRIOR RECIPIENT,
# TO THE EXTENT PERMITTED BY LAW.  RECIPIENT'S SOLE REMEDY FOR ANY SUCH MATTER SHALL
# BE THE IMMEDIATE, UNILATERAL TERMINATION OF THIS AGREEMENT.
#


from argparse import ArgumentParser
import os
import sys
import subprocess
import time
import signal
import webbrowser
import platform

PROCESS_LIST = []
x = True

def check_apps():
    subprocess.run(['git','submodule', 'update','--recursive', '--remote', '--merge', '--force'])


def check_daa_displays():
    cwd = os.getcwd()
    if os.path.isdir(cwd + '/apps/DAA/daa-displays'):
        if os.path.isdir(cwd + '/apps/DAA/daa-displays/dist'):
            return
        else:
            try:
                subprocess.Popen(['{}/Scripts/makeDAADisplay.sh'.format(os.environ.get('WEBGS_HOME'))])
            except:
                print('Unable to make daa-displays')
    return


def start_webgs(args, HOST, DEV, CERT, KEY, CA, NOBROWSER, OPERATING_SYSTEM):
    global PROCESS_LIST
    print('args', args, DEV, HOST, CERT, KEY, CA)

    # launch the servers
    if DEV:
        if OPERATING_SYSTEM == 'Windows':
            ms = subprocess.Popen([sys.executable, os.path.join(os.environ.get('WEBGS_HOME'),"SocketServer","multiprocess_server.py"), "--DEV", "True"],shell=False)
        else:
            ms = subprocess.Popen(["python3", os.path.join(os.environ.get('WEBGS_HOME'),"SocketServer","multiprocess_server.py"), "--DEV", "True"],shell=False)
        
        hs = subprocess.Popen(['node', os.path.join(os.environ.get('WEBGS_HOME'),'main.js'), 'DEV'])

    else:
        if OPERATING_SYSTEM == 'Windows':
            ms = subprocess.run([sys.executable, os.path.join(os.environ.get('WEBGS_HOME'),"SocketServer","multiprocess_server.py"), "--IP", HOST],shell=False)
        else:
            ms = subprocess.Popen(["python3", os.path.join(os.environ.get('WEBGS_HOME'),"SocketServer","multiprocess_server.py"), "--IP", HOST],shell=False)
        
        if CA is 'none':
            hs = subprocess.Popen(['node', os.path.join(os.environ.get('WEBGS_HOME'),'main.js'), CERT, KEY])
        else:
            hs = subprocess.Popen(['node', os.path.join(os.environ.get('WEBGS_HOME'),'main.js'), CERT, KEY, CA])
            
    time.sleep(.5)

    if not NOBROWSER:
        # try to use chrome otherwise use default browser
        try:
            b = webbrowser.get(using='google-chrome')
        except:
            b = webbrowser

        if DEV:
            b.open('http://'+HOST+':8082')
        else:
            b.open('https://'+HOST+':8082')

    # This is used when closing to make sure everything is shutdown
    PROCESS_LIST = [ms, hs]

    # optionally start the offline tile server
    if args[0] != 0 and '.mbtiles' in args[0]:
        try:
            ti = subprocess.Popen(
                ["tileserver-gl", "{}/OfflineTiles/{}".format(os.environ.get('WEBGS_HOME'), args[0])])
            PROCESS_LIST.append(ti)
        except FileNotFoundError:
            print(
                'Failed to launch tile server: Check installation of tileserver-gl and path to files.')

    print(PROCESS_LIST)
    return


def kill_webgs(signum, frame):
    global x
    for item in PROCESS_LIST:
        if item.poll() is None:
            print('Closing: ', item, signum)
            item.send_signal(signum)
        try:
            os.kill(item.pid, 0)
        except:
            pass
        else:
            item.send_signal(9)
    x = False


if __name__ == '__main__':
    # get the args
    parser = ArgumentParser(description=__doc__)
    parser.add_argument("-O", required=False,default=[0], nargs='*', help="name of Tile file")
    parser.add_argument("-HOST", required=False,default=['0.0.0.0'], nargs='*', help="host name, default: 0.0.0.0")
    parser.add_argument("-CERT", required=False,default=['localhost.crt'], nargs='*', help="name of cert file, default: localhost.crt")
    parser.add_argument("-KEY", required=False,default=['localhost.key'], nargs='*', help="name of key file, default: localhost.key")
    parser.add_argument("-CA", required=False,default=['none'], nargs='*', help="name of ca file, default: none")
    parser.add_argument("-DEV", required=False,default=[False], help="Run in Developer Mode (http)")
    parser.add_argument("-UPDATE", required=False, default=[False], help="Check for submodule updates.")
    parser.add_argument("-NOBROWSER", required=False, default=[False], help="Don't auto launch browser.")
    args = parser.parse_args()

    # check the operating system
    OPERATING_SYSTEM = platform.system()
    print(OPERATING_SYSTEM)

    # set WEBGS_HOME env variable
    os.environ['WEBGS_HOME'] = os.getcwd()

    # set the default HOST on windows
    if OPERATING_SYSTEM == 'Windows' and args.HOST[0] == '0.0.0.0':
        args.HOST[0] = '127.0.0.1'

    # check apps, updates all submodules
    if args.UPDATE[0]:
        check_apps()

    # start webgs
    start_webgs(args.O, args.HOST[0], args.DEV[0], args.CERT[0], args.KEY[0], args.CA[0], args.NOBROWSER[0], OPERATING_SYSTEM)

    while x:
        signal.signal(signal.SIGINT, kill_webgs)
        signal.signal(signal.SIGTERM, kill_webgs)


# Example:
# python3 start_webgs.py -HOST {HOST} -CERT localhost.crt -KEY localhost.key -CA RootCA.pem
# python3 start_webgs.py -HOST {HOST} -CERT localhost.crt -KEY localhost.key
# python3 start_webgs.py -HOST {HOST}
# python3 start_webgs.py -DEV True
# python3 start_webgs.py -DEV True -UPDATE True

# WINDOWS: (linux and mac use 0.0.0.0 by default)
# python3 start_webgs.py -DEV True -HOST 127.0.0.1
