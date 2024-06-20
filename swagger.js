import swaggerJSDoc from "swagger-jsdoc";

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Your API Title",
      version: "1.0.0",
      description: "Your API description",
    },
  },
  apis: ["./routes/*.js"], // вкажіть шлях до ваших файлів з endpoint'ами
};

const swaggerSpec = swaggerJSDoc(options);
export default swaggerSpec;
