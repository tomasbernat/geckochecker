#!/usr/bin/env node

import fetch  from 'node-fetch';
import fs from 'fs';
import {dirname, join} from 'path';
import { fileURLToPath } from 'url';


function getDefaultValues(){
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = dirname(__filename);
    const config_path = join(__dirname, 'default-values.json')
    const data = fs.readFileSync(config_path, 'utf8');
    const default_values = JSON.parse(data);
    return default_values;
}

function getParams(){
    let inputArgs = process.argv.slice(2);

    const alias = {
        "c":"currencies",
        "i":"ids",
        "o": "output"
    };

    const arrays = ["currencies", "ids"]
    
    let argumentos = {}

    let atribute = '';

    inputArgs.forEach(arg => {
        if(arg.startsWith('-')){
            atribute = arg.replace(/^[-]+/, '');
            atribute = alias[atribute] || atribute;
            argumentos[atribute] = arrays.includes(atribute) ? [] : '';
        } else {
            if(Array.isArray(argumentos[atribute])){
                argumentos[atribute].push(arg);
            } else {
                argumentos[atribute] = arg;
            }
        }
    })

    return argumentos;
}

async function callApi(ids, currencies, output){
    const url = `https://api.coingecko.com/api/v3/simple/price?ids=${ids.join(',')}&vs_currencies=${currencies.join(',')}`;


    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error('There was a problem on the request.');
        const data = await response.json();

        switch(output){
            case 'list':
                outputList(ids, currencies, data);
                break;
            case 'table':
                outputTable(data);
                break;
            case 'json':
                outputJson(data);
                break;
            case 'csv':
                outputCsv(currencies, data);
                break;
            default:
                if(output !== undefined) console.error(`Output format '${output}' unknown.`)
                outputList(ids, currencies, data);
        }
        
    } catch (err) {
        console.error("Error: ", err.message)
    }
} 

function outputList(ids, currencies, data){
    console.log('Prices at ' + new Date().toLocaleString());
        ids.forEach(id => {
            if(!data[id]){
                console.log(`- ${id}: Crypto not found`);
                return;
            }
            currencies.forEach(curr => {
                const valor = data[id][curr];
                if (valor === undefined) {
                    console.log(`- ${id}/${curr}: Fiat not found`)
                } else {
                    console.log(`- ${id}/${curr}: ${valor}`)
                }
            })
        });
}

function outputTable(data){
    console.log(`Prices at ${new Date().toLocaleString()}`);
    const coins = Object.keys(data).map(id => ({
        coin: id,
        ...data[id]
    }));

    console.table(coins);
}

function outputJson(data){
    const coins = Object.keys(data).map(id => ({
        coin: id,
        ...data[id]
    }));

    console.log(JSON.stringify(coins, null, 2));
}

function outputCsv(currencies, data){
    const encabezado = ['coin', ...currencies];
    const filas = Object.keys(data).map(id => {
        return [id, ...currencies.map(curr => data[id][curr])]
    })

    const salida = [encabezado, ...filas].map(fila => fila.join(',')).join('\n');

    console.log(salida);
}

const args = getParams();

const default_values = getDefaultValues();

const args_ids = args.ids || default_values.ids;
const args_currencies = args.currencies || default_values.currencies;
const args_output = args.output || default_values.output;

await callApi(args_ids, args_currencies, args_output);