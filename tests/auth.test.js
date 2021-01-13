
const user = require("../controllers/auth");

  const mockResponse = () => {
    const res = {};res.status = jest.fn().mockReturnValue(res);
    
    res.json = jest.fn().mockReturnValue(res);
    return res;
  };

  const mockRequest = () => {
    const req = {};
    req.body = jest.fn().mockReturnValue(req);
    req.params = jest.fn().mockReturnValue(req);
    return req; 
  };

// sign up  function testing 
test('signup testing' , async () =>{
  
    const res = mockResponse();
    const req = mockRequest();
    req.body = {
      email:"haidy@gmail.com",
      password:"12223344",
      name:"Haidy",
      gender:"Female",
      phone: "01223311222",
      userType:"Patient"
  };
    await user.signup(req,res);
    expect(res.status).resolves.toHaveBeenCalledWith(201);
    expect(res.json).resolves.toHaveBeenCalledWith({ message: 'Account is created successfully'});          
});