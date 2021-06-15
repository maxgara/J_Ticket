FROM ubuntu:latest
COPY . /
RUN apt-get update
RUN apt-get -y install nodejs curl tcpdump 
#CMD node app.js > output.txt


