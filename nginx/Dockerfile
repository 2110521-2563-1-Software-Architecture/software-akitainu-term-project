FROM nginx
COPY api.conf /etc/nginx/conf.d
ENTRYPOINT ["/docker-entrypoint.sh"]
EXPOSE 10000
EXPOSE 10001
STOPSIGNAL SIGTERM
CMD ["nginx", "-g", "daemon off;"]