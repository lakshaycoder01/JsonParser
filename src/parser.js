import React, { Component } from "react";
import { Link, Route, Switch } from "react-router-dom";
import matchSorter from "match-sorter";

import ReactTable from "react-table";
import "react-table/react-table.css";

import "./parser.css";
import { throws } from "assert";
import { callbackify } from "util";
var Combinatorics = require("js-combinatorics");

class Parser extends Component {
  constructor() {
    super();
    this.state = {
      data: {},
      newdata: [],
      usedChars: [],
      permArr: []
    };
    this.getDetails = this.getDetails.bind(this);
    this.cleanData = this.cleanData.bind(this);
    this.getDetails = this.getDetails.bind(this);
  }
  cleanData(data, cb) {
    this.setData(
      Object.keys(data).map(element => {
        let finaldata = data[element];
        finaldata["id"] = element;
        return finaldata;
      }),
      op => {
        return cb(op);
      }
    );
  }

  setData(final, cb) {
    this.setState({ newdata: final }, () => {
      return cb("done");
    });
  }

  getDetails(temp, cb) {
    var proxyUrl = "https://cors-anywhere.herokuapp.com/";
    fetch(
      proxyUrl +
        "https://s3.ap-south-1.amazonaws.com/ss-local-files/products.json",
      {
        method: "get"
      }
    )
      .then(res => res.json())
      .then(res => {
        this.cleanData(res.products, op => {
          return cb("completed");
        });
      })
      .catch(err => console.log("error occured" + err));
  }
  componentWillMount() {
    this.getDetails("hi", op => {
      console.log(op);
    });
  }

  permute(permutation) {
    var length = permutation.length,
      result = [permutation.slice()],
      c = new Array(length).fill(0),
      i = 1,
      k,
      p;

    while (i < length) {
      if (c[i] < i) {
        k = i % 2 && c[i];
        p = permutation[i];
        permutation[i] = permutation[k];
        permutation[k] = p;
        ++c[i];
        i = 1;
        result.push(permutation.slice());
      } else {
        c[i] = 0;
        ++i;
      }
    }
    console.log(result);
    return result;
  }

  render() {
    return (
      <div className="home-main">
        <div>
          <ReactTable
            data={this.state.newdata}
            columns={[
              {
                Header: "Title",
                filterable: true,
                id: "title",
                accessor: d => d.title,
                filterMethod: (filter, rows) => {
                  var finalarray = [];
                  this.permute(filter.value.split(" ")).map(element => {
                    var elem = element.join(" ");
                    matchSorter(rows, elem, { keys: ["title"] }).forEach(
                      res => {
                        finalarray.push(res);
                      }
                    );
                  });
                  console.log(finalarray);
                  return finalarray;
                },
                filterAll: true
              },
              {
                Header: "Price",
                accessor: "price" // String-based value accessors!
              },
              {
                Header: "Popularity",
                id: "popularity",
                accessor: d => Number(d.popularity) // String-based value accessors!
              }
            ]}
            loading={false}
            sortable={true}
            defaultSorted={[
              {
                id: "popularity",
                desc: true
              }
            ]}
            showPagination={true}
            showPaginationTop={true}
            showPaginationBottom={true}
            showPageSizeOptions={false}
            className="-striped -highlight"
          />
        </div>
      </div>
    );
  }
}

export default Parser;
