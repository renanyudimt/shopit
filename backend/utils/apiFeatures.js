class APIFeatures {
  constructor(query, queryStr) {
    this.query = query;
    this.queryStr = queryStr;
  }

  search() {
    const keyword = this.queryStr.keyword ? {
      name: {
        $regex: this.queryStr.keyword,
        $options: 'i' //case insensitive
      }
    } : { }

    this.query = this.query.find({ ...keyword });
    return this;
  }

  filter() {
    let queryAux = { ...this.queryStr };
    //Removing fields from query
    const removeFields = ["keyword", 'limit', 'page']
    removeFields.forEach(el => delete queryAux[el])

    // Advance filter for price, ratings and etc... 
    //Se por exemplo procurar por algo que tenha 3 de estoque, tem que buscar todos que tenham 3 ou mais.
    queryAux = JSON.stringify(queryAux);
    //sao operadores do mongodb, eles precisam começar com um $ como prefixo 
    /**
     * gt => greater than
     * gte => greater than or equal
     * lt => less than
     * lte => less than or equal
     */ 
    queryAux = queryAux.replace(/\b(gt|gte|lt|lte)\b/g, match => `$${match}`); 
    queryAux = JSON.parse(queryAux);

    this.query = this.query.find(queryAux);
    return this;
  }

  pagination(resPerPage) {
    const currentPage = Number(this.queryStr.page) || 1;
    const skip = resPerPage * (currentPage - 1)
    
    this.query = this.query.limit(resPerPage).skip(skip);
    return this;
  }
}

module.exports = APIFeatures;