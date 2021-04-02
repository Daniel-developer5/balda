const validator = (email: string, pass: string): boolean[] => {
    const emailRegExp = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

    const passRules = [/[a-z]/, /[0-9]/, /.{8,}/]
    
    const valid = [false, false]

    if (emailRegExp.test(email)) {
        valid[0] = true
    }

    if (passRules.every(rule => rule.test(pass))) {
        valid[1] = true
    }

    return valid
}

export default validator