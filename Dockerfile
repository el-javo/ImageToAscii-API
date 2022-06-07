FROM node:16

WORKDIR /app

COPY package*.json ./

RUN npm install

RUN apt-get update

RUN apt-get -y install python3-pip

COPY requirements.txt ./

RUN pip3 install --upgrade pip

RUN pip3 install -r requirements.txt

COPY . .

CMD ["npm", "start"]