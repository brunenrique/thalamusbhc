import dynamic from 'next/dynamic';
import 'swagger-ui-react/swagger-ui.css';
import swaggerJSDoc from 'swagger-jsdoc';

const SwaggerUI = dynamic(() => import('swagger-ui-react'), { ssr: false });

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Thalamus API',
      version: '1.0.0',
    },
  },
  apis: ['src/app/api/**/*.ts'],
};

const spec = swaggerJSDoc(options);

export default function ApiDocsPage() {
  return (
    <div className="p-4">
      <SwaggerUI spec={spec} />
    </div>
  );
}
