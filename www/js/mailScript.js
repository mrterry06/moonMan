let express = require('express');
let app		= express();
let port 	= 8080;
let nodemailer = require("nodemailer");
///FOR EC2 INSTANCE
 var smtpConfig = { 
	host: 'smtp.gmail.com',
	port: 465,
	secure: true,
	auth: {
		user: 'mrterry06@gmail.com',
		pass: 'Elfin123'
	}
};

var transporter = nodemailer.createTransport(smtpConfig);

app.post("/mail", function(req, res){


	 var mailOption = {
		from: sender,
		to: 'mrterry06@gmai.com',
		subject: subject ,
		text: body,
		html: element
	};

	transporter.sendMail(mailOption, function(err, info){
		if (err){
			console.warn(err);
			
			res.send(err);
			return false;
		}else{
			res.send(true);
			console.log('Message sent: ' + info.response );
			return true;
		}
 		

	});	

});

app.listen(port);
