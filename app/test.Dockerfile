FROM alpine:3.22
WORKDIR /app

RUN apk add --no-cache uhttpd

RUN echo "hello there!" > index.html

EXPOSE 80
CMD ["uhttpd", "-fp80"]
