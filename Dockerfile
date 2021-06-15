FROM ubuntu:latest
COPY cticket /
RUN apt-get update
RUN apt-get -y install nodejs curl tcpdump 
#CMD node app.js > output.txt


