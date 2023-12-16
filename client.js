const soap = require('soap');
const wsdlUrl = 'http://localhost:8000?wsdl';

const args = process.argv.slice(2);

soap.createClient(wsdlUrl, {}, function(err, client) {
  if (args.length === 0) {
    console.log('Invalid command. Please use either -l or -f <from date> <to date> <valute ID>.');
  }

  if (args.includes('-l')) {
    client.getValutes({}, function(err, result) {
      if (err) {
        console.log(err);
        return;
      }
      console.log(JSON.stringify(result.response.response));
    });
  }

  if (args.includes('-f') && args.length > args.indexOf('-f') + 3) {
    const index = args.indexOf('-f');
    const params = { FromDate: args[index + 1], ToDate: args[index + 2], ValutaCode: args[index + 3] };
    client.getValute(params, function(err, result) {
      if (err) {
        console.log(`Server or user input error`);
        return;
      }
      console.log(JSON.stringify(result.response.response));
    });
  }
});
