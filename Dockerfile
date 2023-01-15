FROM python:3.10.0
ENV PYTHONUNBUFFER 1
RUN mkdir -p /webshocket/app
WORKDIR /webshocket/app
COPY requirements.txt ./
RUN apt-get update && apt-get -y install python3 python3-pip
RUN pip install -r requirements.txt
