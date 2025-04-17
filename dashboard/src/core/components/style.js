import app from '../../config/configApp';

[

].map((c) => {
    app.component(`sd${c.name}`, c);
});
