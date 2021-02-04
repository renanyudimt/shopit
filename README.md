O que temos aqui ?

### BACKEND:
  # Arquitetura baseada em MVC
  
  # ./server.js -  Criacao do servidor e abertura de conexao, path do DB, cloduinary settings
  # ./app.js => cors, middlewares, cookie-parser (necessario para lers os cookies das requisicoes), import das rotas dinamicas e separadas por models, middleware de error
  # ./config/config.env => variaveis de ambiente do sistema
  # ./config/database.js => conexao com o banco de dados mongodb
  # ./data/products.js => usado pra popular o db quando estiver vazio
  # ./models/... => todos os modelos do banco
  # ./middlewares/auth => 
    1. - isAuthenticatedUser() verifica qual é o usuario que esta fazendo a requisicao, e adiciona ao corpo do header o contexto de usuario, caso o token nao esteja vencido ou errado
    1. - authorizedRoles() restringe o acesso de usuarios que nao sao das roles autorizada.
  
  ./middlewares/error.js => custom error handler, retorna a mensagem de erro (gravada no model) ou uma generica de internal server error
  ./middlewares/getAsyncErros.js => é um try/catch escondido, no catch, chama a funcao next passando pro middleware de error.
  ./controllers/orderController.js =>
    - createOrder(): ira criar uma ordem para o usuario tal, atualizar o BD subtraindo o quantitdade de itens comprados, colocar a status como "processing" e retornar a order
    - changeOrderStatus() altera o status da order pelo id
    - getOrder() retorna a order por id
    - getOrders() busca todas as orders do usuario
    - getAllOrders() busca as orders de todos os usuarios, usado por admins
    - getTargetOrder() busca a order por especifico ID, usado por admins
    - updateTagetOrder() altera a order, usado por admins
    - deleteOrder() deleta a order, usado por admins
    - updateStock() atualiza o stock dos produtos de uma order
  
  ./controllers/paymentController.js =>
    - checkProductsStock() verifica se a quantidade pedida existe de tal produto
    - sendStripeApi() retorna a stripe API KEY pro client
    - processPayment() cria uma intencao de pagamento e retorna o client secret 

  ./controllers/productController.js => 
    - newProduct() cadastra um novo produto, usado por admins
    - getProducts() busca todos os produtos e retornar para o client com seus respectivos filtros
    - getProduct() busca um produto especifico e retorna
    - updateProduct() altera os dados de um produto, usado por admins
    - deleteProduct() deleta um produto, usado por admins
    - createProductReview() cria uma review para um produto
    - getProductReviews() busca todas as reviews de um produto 
    - deleteReview() deleta a review de um produto feito por um usuario
    - getCartProducts() busca os produto do carrinho

  ./controllers/productController.js => 
    - registerUser() registra um usuario
    - login() login de usuario, retorna um cookie criptografado que sera salvo no http, acessivel por request apenas 
    - logout() expira o cookie e desloga o usuario
    - forgotPassword() cria uma um token criptografado de forgot password e envia um email para o cliente
    - resetPassword() funcao de reset password, vai encriptar o token e verificar se e o mesmo salvo no banco
    - getUser() busca os dados de um usuario, no caso, o que esta logado.
    - updatePassword() funcao de atualizacao de password atraves do site, sem ter esquecido.
    - updateUser() atualiza os dados do usuario
    - getAllUsers() busca todos os usuarios, usado por admins 
    - getTargetUser() busca um usuario por ID, usado por admins 
    - updateTargetUser() atualiza um usuario por ID, usado por admins
    - deleteTargetUser() deleta o usuario pelo ID

  ./routes/order.js =>
    - /order/new => url para criacao de uma nova order para um usuario logado
    - /order/:id => busca os dados de uma order por id
    - /admin/orders => busca todas as orders 
    - /admin/order/:id => buscar/atualiza/deleta uma order pelo id

  ./routes/payment.js =>
    - /payment/process => cria uma intencao de pagamento e retorna o client secret 
    - /stripeapi => retorno da stripe secret

  ./routes/products.js => 
    - /products => retorna todos os produtos
    - /product/:id => retorna um produto
    - /admin/product/new => criacao de um produto 
    - /admin/product/:id => update/delete de um produto
    - /cart => retorno do carrinho do usuario os produtos, stock e etc
    - /review => deleta/cria uma review para um produto
    - /reviews/ => retorna as reviews de um produto
    
  ./rotues/users.js => 
    - /register => regisro de usuario
    - /login => login de usuario
    - /password/forgot => envio de email e criacao do token de uma nova senha
    - /password/reset/:token => validacao de uma nova senha
    - /password/update => atualizacao da senha do usuario
    - /user/update => update dos dados do usuario
    - /logout => expira o token de usuario
    - /user => busca dados do usuario
    - /admin/users/ => busca todos os usuarios
    - /admin/user/:id => busca/atualiza/deleta um usuario
