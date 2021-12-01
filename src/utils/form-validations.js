module.exports = {
    addSiteUrl,
    addSiteName,
    selectSite,
    linkOrKeywordsValidation,
    sizeValidation,
    quantityValidation,
    billingProfileValidation,
    checkPassword,
    checkUserName
};

function billingProfileValidation(context) {
    let isFormValid = false;
    if (context.state.billingProfile === 1) {
        context.setState({billingProfile_error: "Please select billing profile"});
    } else {
        context.setState({billingProfile_error: ""});
        isFormValid = true;
    }
    return isFormValid;
}


function checkPassword(context) {
    let isFormValid = false;
    if (context.state.password === "") {
        context.setState({password_error: "Please enter password"});
    }  else {
        context.setState({password_error: ""});
        isFormValid = true;
    }
    return isFormValid;
}

function checkUserName(context) {
    let isFormValid = false;
    if (context.state.username === "") {
        context.setState({username_error: "Please enter username"});
    }  else {
        context.setState({username_error: ""});
        isFormValid = true;
    }
    return isFormValid;
}

function quantityValidation(context) {
    let isFormValid = false;
    if (context.state.quantity === "") {
        context.setState({quantity_error: "Please enter quantity"});
    }  else {
        context.setState({quantity_error: ""});
        isFormValid = true;
    }
    return isFormValid;
}

function sizeValidation(context) {
    let isFormValid = false;
    if (context.state.size === "") {
        context.setState({size_error: "Please enter size"});
    }  else {
        context.setState({size_error: ""});
        isFormValid = true;
    }
    return isFormValid;
}

function addSiteUrl(context) {
    let isFormValid = false;
    if (context.state.add_site_url === "") {
        context.setState({add_site_url_error: "Please enter site url"});
    } else if (!checkvalidURL(context.state.add_site_url)) {
        context.setState({add_site_url_error: "Enter valid url"});
    } else {
        context.setState({add_site_url_error: ""});
        isFormValid = true;
    }
    return isFormValid;
}

function linkOrKeywordsValidation(context) {
    let isFormValid = false;
    if (context.state.keywords === "" && context.state.link === "") {
        context.setState({keywords_link_error: "Please fill atleast link or keyword"});
    } else {
        if (context.state.link !== "") {
            if (!checkvalidURL(context.state.link)) {
                context.setState({keywords_link_error: "Enter valid url"});
            }else{
                context.setState({keywords_link_error: ""});
                isFormValid = true;
            }
        } else {
            context.setState({keywords_link_error: ""});
            isFormValid = true;
        }
    }
    return isFormValid;
}

function selectSite(context) {
    let isFormValid = false;
    if (context.state.site === 1) {
        context.setState({site_error: "Please select site"});
    } else {
        context.setState({site_error: ""});
        isFormValid = true;
    }
    return isFormValid;
}

function addSiteName(context) {
    let isFormValid = false;
    if (context.state.add_site_name === "") {
        context.setState({add_site_name_error: "Please enter site name"});
    } else {
        context.setState({add_site_name_error: ""});
        isFormValid = true;
    }
    return isFormValid;
}

function checkvalidURL(str) {
    var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
        '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.)+[a-z]{2,}|' + // domain name
        '((\\d{1,3}\\.){3}\\d{1,3}))' + // OR ip (v4) address
        '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + // port and path
        '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
        '(\\#[-a-z\\d_]*)?$', 'i'); // fragment locator
    return !!pattern.test(str);
}