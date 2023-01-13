# Web-client

## Project setup
```
yarn install
```

### Compiles and hot-reloads for development
```
yarn start
```

### Compiles and minifies for production
```
yarn build
```

### Lints and fixes files
```
yarn lint
```

### Run unit tests
```
yarn test
```

### Lints release/release candidate version
```
yarn rsc %release-version%
```

### Build docker image with version
```dockerfile
 docker build --no-cache --progress=plain --build-arg BUILD_VERSION=1.0.0-rc.0 -t vue-template .
```

### env.js variables
```
 VITE_APP_API_URL: 'http://localhost:8000/_/api/'
 VITE_APP_APP_NAME: 'Swapica'
 VITE_APP_LANDING_URL: ''
```
