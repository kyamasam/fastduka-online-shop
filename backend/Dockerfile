FROM python:3.12

# setup environment variable
ENV DockerHOME=/home/app/webapp
ENV IN_DOCKER=1

# set work directory and create necessary directories
RUN mkdir -p $DockerHOME
RUN mkdir -p $DockerHOME/static
RUN mkdir -p $DockerHOME/media

# set permissions for static and media directories
RUN chmod -R 755 $DockerHOME/static
RUN chmod -R 755 $DockerHOME/media

# where your code lives
WORKDIR $DockerHOME

# set environment variables
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# install dependencies
RUN pip install --upgrade pip

# copy requirements first to leverage Docker cache
COPY requirements.txt $DockerHOME/
RUN pip install -r requirements.txt

# copy whole project to your docker home directory
COPY . $DockerHOME

# Make sure static files are collected after code is copied
RUN python manage.py collectstatic --no-input

# port where the Django app runs
EXPOSE 8000

# Copy and set entrypoint
COPY docker-entrypoint.sh /usr/local/bin/
RUN chmod +x /usr/local/bin/docker-entrypoint.sh
ENTRYPOINT [ "/usr/local/bin/docker-entrypoint.sh" ]