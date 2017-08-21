import React, { Component } from 'react'
import logo from './logo.svg'
import './App.css'
import Autocomplete from 'react-autocomplete'
import fetch from 'isomorphic-fetch'
import Details from './Details'

export default class App extends Component {
  
  constructor(props) {
    super(props)
    //set initial state
    this.state = { 
      value:'' , 
      searchTerms:[''],
      apiData: {},
      currentSearchMatches:[], 
      selectedPerson:''
    }
  }

  getCurrentSearchMatches(items, value){
    //filter existing data against search value for partial match and return array of names. 
    return items.filter(item => item.name.toUpperCase()
    .includes(value.toUpperCase()))
    .map(item => item.name)
  }

  getApiData(resource, value, type){
    //add container for expected data if not present
    !this.state.apiData[resource] && this.setState(
      {apiData: Object.assign(
        {}, this.state.apiData, {[resource]:{items: []}}
      )}
    )

    //set API URL for searching or direct call (future expansion)
    const apiUrl = type === 'search' ? `https://swapi.co/api/${resource}/?search=${value}` : value
    
    //fetch the API data
    fetch(apiUrl)
    .then(res => res.json())
    .then((json) => {

      //set result(s) to variable as array
      let items = type === 'search' ? json.results : [json]

      //use spread to merge the existing API data
      items = [...this.state.apiData[resource].items, ...items]

      //use filter along with findIndex to remove any duplications
      items = items.filter(
        (value, index, array) => array.findIndex((element) => {
          return element.url === value.url
        //findIndex will always return the first index, 
        //so later duplications will not be matched and returned
        }) === index
      )

      if(type === 'search'){ 
        //get current search matches for autocomplete use
        const currentSearchMatches = this.getCurrentSearchMatches(items, value)
        //update state with new data and currentSearchMatches array
        this.setState({
          //immutable state update
          apiData: Object.assign(
            {}, this.state.apiData, {[resource]:{items}}
          ), 
          currentSearchMatches
        })
      }else{
        //update state with new data
        this.setState({
          //immutable state update
          apiData: Object.assign(
            {}, this.state.apiData, {[resource]:{items}}
          )
        })
      }
    })
  }

  handleChange = e => {
      const value = e.target.value
      
      //Only call API on new search terms
      if(!this.state.searchTerms.includes(value)){
        
        //searchTerms declared & overwritten to prevent 
        //jest coverage bug that crashes V8
        let searchTerms = [value]
        //add any new search terms to the array
        searchTerms = [...this.state.searchTerms, ...searchTerms]

        //call setState for value first to prevent it getting
        //held up with the fetch promise
        this.setState({ value, searchTerms })
        //call getApiData
        this.getApiData('people', value, 'search')

        //console.log('API_CALL_COUNT'
        // TEST CASE: type 'luke sky' del* type 'darth vader' del* 
        // preload all people data:     9 API CALLS (all filtering, no searching) ❌
        // every key press:             38 API CALLS ❌
        // min 10 Autocomplete results: 25 API CALLS ❌
        // omit past search terms:      19 API CALLS 👍

      }else{
        //get current search matches for autocomplete use
        const currentSearchMatches = this.getCurrentSearchMatches(this.state.apiData.people.items, value)
        //set current search matches to state
        this.setState({ value,  currentSearchMatches})
      }
  }

  handleSelect = e => {
    //onSelect set the state by setting the selected person
    //& removing the search value
    this.setState({ value:'', selectedPerson:e })
  }

  handleKeyPress = e => {
    //onKeyPress === Enter call handleSelect, otherwise do nothing
    if (e.key === 'Enter') {
      this.handleSelect(e.target.value)
    } 
  }
  
  getDetails(){
    //use findIndex to locate the state data for the selected person
    const personIndex = this.state.apiData.people.items.findIndex((element) => {
      return element.name === this.state.selectedPerson
    })
    //use the data location to return the data
    return this.state.apiData.people.items[personIndex]
  }

  render() {
    //console.log(this.state)
    return (
      <div className="App">
        <div className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-heading">SWAPI People Search</h1>
          <h2 className="App-intro">
            Search for people from the Star Wars movies
          </h2>
        </div>
        <div className="search-box">
          {/* the react-autocomplete component */}
          <Autocomplete
            value={this.state.value}
            items={this.state.currentSearchMatches}
            getItemValue={(item) => item}
            inputProps={ 
              {
                placeholder: 'Search for people...', 
                id:'search', 
                'aria-label':"Search for people", 
                onKeyPress:this.handleKeyPress,
                className: "search-box__input"
              }
            }
            renderItem={(item, isHighlighted) =>
              <div 
                className={ isHighlighted ? 'search-box__option search-box__option--highlighted' : 'search-box__option' }
              >
                {item}
              </div>
            }
            onChange={this.handleChange}
            onSelect={this.handleSelect}
          />
        </div>
        <div className="person-details">
            {/* display details if a person is selected */}
            {this.state.selectedPerson && <Details {...this.getDetails()} />}
        </div>
      </div>
    )
  }
}

/*
WISH LIST
Handle fetch errors
Queue fetch requests 
Display data from other resources (Films, Species, etc)
add Wookiee translation
add redux (could warrant it if all api resources are used)
*/

