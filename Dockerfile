FROM ruby:2.6

ENV LC_ALL C.UTF-8
ENV LANG en_US.UTF-8
ENV LANGUAGE en_US.UTF-8

WORKDIR /usr/src/app

COPY Gemfile ./
COPY Gemfile.lock ./

ENV BUNDLER_VERSION 2.2.31

RUN gem update --system \
    && gem install bundler -v $BUNDLER_VERSION \
    && bundle install -j 4

RUN gem install bundler && bundle install

EXPOSE 4000
