const http = require('http');
const soap = require('soap');
const url = 'https://www.cbr.ru/DailyInfoWebServ/DailyInfo.asmx?WSDL';

async function getValutes() {
  const args = { On_date: new Date().toISOString() };
  const valutes = {};

  var client = await soap.createClientAsync(url);
  var result = await client.EnumValutesXMLAsync(args);
  result[0].EnumValutesXMLResult.ValuteData.EnumValutes.forEach((e) => valutes[e.VcharCode] = { code: e.VcommonCode, name: e.Vname, value: '-' });

  var result = await client.GetCursOnDateXMLAsync(args);
  result[0].GetCursOnDateXMLResult.ValuteData.ValuteCursOnDate.forEach((e) => valutes[e.VchCode].value = e.Vcurs);

  return Object.values(valutes);
}

async function getValute(args) {
  const valutes = [];

  var client = await soap.createClientAsync(url);
  var result = await client.GetCursDynamicXMLAsync(args)

  result[0].GetCursDynamicXMLResult.ValuteData.ValuteCursDynamic.forEach((e) => valutes.push({ date: e.CursDate, value: e.Vcurs }))

  return Object.values(valutes);
}

const myService = {
  Service: {
    Port: {
      getValutes: async (args) => {
        return {
          response: await getValutes()
        };
      },

      getValute: async (args) => {
        return {
          response: await getValute(args)
        };
      }
    }
  }
};

const wsdl = require('fs').readFileSync('schema.wsdl', 'utf8');

const server = http.createServer((_, response) =>
  response.end('404: Not Found'));

server.listen(8000);

soap.listen(server, '/', myService, wsdl, () =>
  console.log('server start'));