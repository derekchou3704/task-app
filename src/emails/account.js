const sgMail = require('@sendgrid/mail')


sgMail.setApiKey(process.env.SENDGRID_API_KEY)

const sendWelcomeEmail = async (email, name) => {
    const msg = {
        to: email,
        from: 'derekchou3704@gmail.com',
        subject: 'Thanks For Joining In!',
        text: `Welcone to the app, ${name}`
    }
    try {
        await sgMail.send(msg)
        // console.log('Email sent')
    } catch (e) {
        console.log(e)
    }
}

const sendCancelationEmail = async (email, name) => {
    const msg = {
        to: email,
        from: 'derekchou3704@gmail.com',
        subject: 'Tell Us why You Choose to Cancel',
        text: `We are sad that you canceled, ${name}, tell us more about why you canceled`
    }
    try {
        await sgMail.send(msg)
        // console.log('Email sent')
    } catch (e) {
        console.log(e)
    }
}

module.exports = {
    sendWelcomeEmail,
    sendCancelationEmail
}
