import app from './app';
import { winstonLogger } from './util';

app.listen(app.get('port'), () => {
  winstonLogger.info(
    'App is running at http://localhost:%d in %s mode',
    app.get('port'),
    app.get('env')
  );
  winstonLogger.info('Press CTRL-C to stop');
});
