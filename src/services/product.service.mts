import productModel from "../models/product.model.mts";
import type {Product, QueryParams, FindProductObj} from "../models/types.mts";
import {buildPaginationWrapper, formatFields} from './utils.mts'


 const getAllProducts = async (query:QueryParams) => {
  let find:FindProductObj = {search: {},
    limit: query.limit? parseInt(query.limit) : 20,
    offset: query.offset? parseInt(query.offset) : 0
  }
  const {q, category, fields} = query; 
    
  find.fieldFilters = fields? formatFields(fields): undefined;
  if(category) {
      find.search.category = category as Product["category"];
  }


  // now that we know what we have send it to the model and get the results.
 const data = await productModel.getAllProducts(find);
 // take the results and format them correctly
 const wrapper = buildPaginationWrapper(data.totalCount, query)
 // don't forget to actually set the records in there.
 wrapper.results = data.results
 return wrapper
};

const getProductById = async (id: string) => {
  return await productModel.getProductById(id);
};

const searchProducts = async (query: QueryParams) => {
  const find: FindProductObj = {
    search: {}, // the model replaces this with the $or filter
    limit: query.limit ? parseInt(query.limit) : 20,
    offset: query.offset ? parseInt(query.offset) : 0,
    fieldFilters: query.fields ? formatFields(query.fields) : undefined,
  };

  const data = await productModel.searchProducts(query.q?.trim() ?? "", find);

  const wrapper = buildPaginationWrapper(data.totalCount, query);
  wrapper.results = data.results;
  return wrapper;
};

export default {
  getAllProducts,
  getProductById,
  searchProducts
};