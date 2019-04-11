# keep-comcast-in-check

Internet speed consistency has been a real pain for me lately. Wiring this up to monitor and alert when speed deteriorates so I can jump on a call with support.

### Usage

To start, edit the `CONFIG` file with your personal settings. Then kick off the program with one of these methods:

Execute directly with node:  
```
$ npm run start
```  

Use docker (if running on rasp pi):  
```
$ docker build -t speed_monitor .
$ docker run -d speed_monitor
```  

### Notes:
- To have text alerts work, you will need to input your TWILIO credentials inside /lib/failure-actions/text-alert/TWILIO_CONFIG  

### Possible future TODOs:  
- add more failure actions such as email, IFTTT, and/or lamdas
- instead of sending text alert, depending on time, automatically create a call with me and comcast support

Zillwc  
