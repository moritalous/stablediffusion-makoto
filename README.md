
* Backend deploy

```
cd stable-diffusion-lambda/
sam build
sam deploy --guided
```

* Update `lambdaUrl` variable in `src/App.tsx`

* Start Frontend

```
npm ci
npm start
```