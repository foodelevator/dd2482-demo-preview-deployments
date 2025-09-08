FROM alpine:3.22
WORKDIR /app

RUN apk add --no-cache uhttpd

RUN echo "<h1>hello there!</h1>" > index.html

EXPOSE 80
CMD ["uhttpd", "-fp80"]
