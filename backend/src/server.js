import app from './app.js';

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
}).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
        console.error(`Port ${port} is already in use. Please use a different port.`);
    } else {
        console.error(`Failed to start server: ${err.message}`);
    }
});
