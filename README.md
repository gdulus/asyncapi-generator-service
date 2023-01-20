# asyncapi-generator-service

Simple HTTP wrapper around [AsyncAPI generator](https://www.asyncapi.com/tools/generator). 

### API

#### Generate index.html page
```shell
GET /generator/index-page?src=<URL>
```
Generates index.html page of the documentation based on document AsyncAPI file.
Parameter `src` is mandatory in format of valid URL under which documentation can be found
