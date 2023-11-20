# texlive image also provides python
FROM texlive/texlive:latest
RUN apt-get update
RUN apt-get install -y python3 python3-pip p7zip-full

WORKDIR /engine

COPY requirements.txt ./
RUN pip3 install -r requirements.txt

COPY . ./
COPY assets/fonts /usr/share/fonts/OTF
ENTRYPOINT ["python3" "main.py"]