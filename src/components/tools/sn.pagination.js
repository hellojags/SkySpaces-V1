import React from 'react';
import Pagination from '@material-ui/lab/Pagination';
import { ITEMS_PER_PAGE } from "../../sn.constants"

class SnPagination extends React.Component{
    constructor(props){
        super(props);
        this.onChange = this.onChange.bind(this);
    }

    onChange(evt, page){
        this.props.onChange(page);
    }
    
    getPaginationCount(){
        const totalItemsCount = this.props.totalCount;
        return Math.ceil(totalItemsCount/ITEMS_PER_PAGE);
    }

    render(){
        const { page } = this.props;
        return (
            <Pagination 
                count={this.getPaginationCount()} 
                page={page} 
                onChange={this.onChange}
                color="primary" 
                className="cards-pagination" />
        );
    }
}

export default SnPagination;