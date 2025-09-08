FROM alpine:3.22
WORKDIR /app

RUN apk add --no-cache uhttpd

COPY . .

EXPOSE 80
CMD ["uhttpd", "-fp80"]
