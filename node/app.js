const express = require('express');
const pool = require('./database');

const app = express();

app.use(express.json());

const getPeople = () => {
    return new Promise((resolve, reject) => {
        pool.query('SELECT * FROM people', (error, results) => {
          if (error) {
            return reject(error.stack);
          }
          resolve(results);
        });
    });
};

app.get('/', async (req, res) => {
    
    console.log(`Uma nova requisicao para app.js. Url: ${req.get('host')} ${req.originalUrl}`);

    try {

        const peoples = await getPeople();
        
        console.log(`Retorno da tabela people: ${JSON.stringify(peoples)}`);
        var html = '<h1>Full Cycle Rocks!!</h1>';
    
        if (peoples.length > 0) {
            html += `<div><table border="1"><tr><td>Id</td><td>Name</td></tr>`;

            const peopleString = JSON.stringify(peoples);
            console.log('JSON string:', peopleString);

            const peopleObject = JSON.parse(peopleString);
            console.log('Parsed JSON object:', peopleObject);

            peopleObject.forEach(people => {
                
                console.log(`Id: ${people.id}`);
                console.log(`Name: ${people.name}`);
                
                html += `<tr><td>${people.id}</td>`;
                html += `<td>${people.name}</td></tr>`;                
            });
        
            html += '</table></div>';
            res.send(html);

        } else {
            html += '<div><label> Nenhuma pessoa cadastrada na base!</label></div>'
            res.send(html);
        }
    } catch(error) {
        console.error('Error fetching people:', error.stack);
        res.status(500).send('Error fetching people');
    }           
});

app.get('/create', (req, res) => {

    pool.getConnection((error, connection) => {
        if (error) {
            console.error('Error getting connection from pool:', error.stack);
            if (!res.headersSent) {
                res.status(500).send('Error getting connection from pool');
            }
            return;
        }

        const name = req.query.name;
        console.log(`Name: ${name}`)

        const query = `INSERT INTO people(name) VALUES('${name}');`;
        console.log(`Vai inserir na tabela people - query: ${query}`);

        connection.query(query, (error, results, fields) => {
            
            connection.release();

            if (error) {
                console.error('Error executing insert query:', error.stack);
                if (!res.headersSent) {
                    res.status(500).send('Error executing insert query');
                }
                return;
            }
            
            return res.status(201).send('Name inserted with success!');
        });    

    });

});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});