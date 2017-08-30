import React, { Component } from 'react'
import PropTypes from 'prop-types'
import './Details.css'

export default class Details extends Component {

  static propTypes = {
    name: PropTypes.string,
    edited: PropTypes.string,
    created: PropTypes.string,
    species: PropTypes.array,
    height: PropTypes.string,
    eye_color: PropTypes.string,
    birth_year: PropTypes.string,
    gender: PropTypes.string,
    vehicles: PropTypes.array,
    hair_color: PropTypes.string,
    starships: PropTypes.array,
    skin_color: PropTypes.string,
    homeworld: PropTypes.string,
    films: PropTypes.array
  }

  shouldComponentUpdate(nextProps, nextState) {
    return nextProps.name === this.props.name ? false : true
  }


  buildDisplay(){

    //set props to variable
    const obj = this.props
    //array of props not for output
    let ignoreList = ['created', 'edited', 'url']
    //empty array to be populated with output elements
    let listItems = []

    //for in loop to iterate over the obj props
    for (let prop in obj) {
      
      //only continue if prop not on ignoreList
      if(!ignoreList.includes(prop)){

        //remove underscores from prop keys
        let readerProp = prop.replace(/_/g, " ")
        //transform first char to uppercase
        readerProp = readerProp.charAt(0).toUpperCase() + readerProp.slice(1)

        //if the prop is a URL then convert description to 1
        //(stunting functionality to keep app small)
        if(obj[prop].includes('https://swapi.co/api')){
          listItems.push(
              [<dt className="person-details__term">{readerProp}</dt>,
              <dd 
                id={`person-details__${prop}`} 
                className="person-details__description"
              >
                1
              </dd>]
          )
        //else if the prop is an array then convert description to a count
        //(stunting functionality to keep app small)
        }else if(Array.isArray(obj[prop])){
          listItems.push(  
              [<dt className="person-details__term">{readerProp}</dt>,
              <dd 
                id={`person-details__${prop}`} 
                className="person-details__description"
              >
                {obj[prop].length}
              </dd>]
          )
          
        }else{
          //if prop is height & a number add 'cm'
          let description = prop === 'height' ? `${obj[prop]}${isNaN(obj[prop])?'':'cm'}` : obj[prop]
          //if prop is mass & a number add 'kg'
          description = prop === 'mass' ? `${obj[prop]}${isNaN(obj[prop])?'':'kg'}` : description

          listItems.push(
              [<dt className="person-details__term">{readerProp}</dt>,
              <dd 
                id={`person-details__${prop}`} 
                className="person-details__description"
              >
                {description}
              </dd>]
          )
        }
      }
    }
    return console.log('render Details') || (
      <div>
        <h3 className="person-details__title">{this.props.name}</h3>
        <dl className="person-details__list">
          {listItems}
        </dl>
      </div>
    )
    
  }

  render() {
      return this.props.url ? 
      //if the prop url is present (prop present in all resource schema)
      //call and return buildDisplay
      this.buildDisplay() : 
      //else present search error
      <div className="person-details__error">
        <h3>These aren't the Droids you're looking for...</h3>
        <p>try searching again</p>
      </div>
  }
}