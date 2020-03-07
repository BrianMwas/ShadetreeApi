# Obo
job finding site rest api


# Deploy our application to production.
The app uses pm2 package because it will allow running in the background. If you visit the read endpoint and crash the application, pm2 will automatically restart it. You won’t see any of that in the terminal because it’s running in the background. If you want to watch pm2 do its thing, you gotta run pm2 log 0. The 0 is the ID of the process we want to see logs for.
