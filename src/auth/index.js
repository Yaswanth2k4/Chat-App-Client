export const doLogin=(id,name)=>{
    localStorage.setItem("data",JSON.stringify(id));
    localStorage.setItem("name",JSON.stringify(name));
}

export const doLogout=()=>{
    localStorage.removeItem("data");
    localStorage.removeItem("name");
}

export const isLoggedIn=()=>{
    const data=localStorage.getItem("data")
    if(data!=null)
    {
        return true
    }
    return false;
}

export const getCurrentUser=()=>{
    if(isLoggedIn)
    {
        return {
            id:JSON.parse(localStorage.getItem("data")),
            name:JSON.parse(localStorage.getItem("name"))
        };
    }
    else
    {
        return false;
    }
}