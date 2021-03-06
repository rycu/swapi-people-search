import React from 'react'
import ReactDOM from 'react-dom'
import { shallow } from 'enzyme' //Shallow Rendering
import App from './App'
import nock from 'nock' //HTTP mocking


const setup = () => {
  const output = shallow(<App/>)
  return output
}

describe('components', () => {
  describe('App', () => {

    it('renders without crashing', () => {
      const div = document.createElement('div')
      ReactDOM.render(<App />, div)
    })

    it('should set the initial state', () => {
      const output = setup()
      expect(output.state()).toEqual({ value:'' , searchTerms:[''],  apiData:{}, currentSearchMatches:[], selectedPerson:''})      
    })

    it('should successfully run getCurrentSearchMatches', () => {
      const output = setup()
      expect(output.instance().getCurrentSearchMatches([{name:'TEST1'}, {name:'2TEST'}, {name:'OTHER'} ], 'TEST')).toEqual(['TEST1', '2TEST'])
    })

    describe('API fetching', () => {

      afterEach(() => {
        nock.cleanAll()
      })

      it('should successfully run getApiData', () => {
        nock('https://swapi.co')
        .get('/api/films/1')
        .reply(200, {"title": "TEST_TITLE"})
        const output = setup()
        output.instance().getApiData("films","https://swapi.co/api/films/1", "call")
      })

      it('should successfully run getApiData search', () => {
        nock('https://swapi.co')
        .get('/api/people/?search=L')
        .reply(200, {"results":[]})
        const output = setup()
        output.instance().getApiData("people","L", "search")
      })

      it('should run getApiData but fail on fetch error', () => {
        nock('https://swapi.co')
        .get('/api')
        .reply(404)
        const output = setup()
        output.instance().getApiData("films","https://swapi.co/api", "call")
      })

    })

    it('should call handleChange on change', () => {
      const output = setup()
      output.find('.search-box').children().node.props.onChange({target: { value:'TEST_VALUE' } })
      expect(output.state().searchTerms).toEqual(["", "TEST_VALUE"])
      expect(output.state().value).toEqual("TEST_VALUE")
    })

    it('should successfully run handleChange with used searchTerm', () => {
      const output = setup()
      output.instance().handleChange({target: { value:'TEST_VALUE' } })
      output.instance().handleChange({target: { value:'TEST_VALUE2' } })
      output.instance().handleChange({target: { value:'TEST_VALUE' } })
      expect(output.state().searchTerms).toEqual(["", "TEST_VALUE", "TEST_VALUE2"])
      expect(output.state().value).toEqual("TEST_VALUE")
    })

    it('should call handleSelect on select', () => {
      const output = setup()
      output.setState({apiData:{people:{items:[]}}})
      output.find('.search-box').children().node.props.onSelect('TEST_VALUE')
      expect(output.state().selectedPerson).toEqual('TEST_VALUE')
    })

    it('should call handleKeyPress on keyPress', () => {
      const output = setup()
      output.setState({apiData:{people:{items:[]}}})
      output.find('.search-box').children().node.props.inputProps.onKeyPress({key: 'not_enter', target:{value: 'ANOTHER_TEST_VALUE'}})
      expect(output.state().selectedPerson).toEqual('')
      output.find('.search-box').children().node.props.inputProps.onKeyPress({key: 'Enter', target:{value: 'TEST_VALUE'}})
      expect(output.state().selectedPerson).toEqual('TEST_VALUE')
    })

    it('should successfully run getDetails', () => {
      const output = setup()
      output.setState({apiData:{people:{items:[{name: 'TEST_NAME', other: "TEST_VALUE"}]}}, selectedPerson: 'TEST_NAME'})  
      expect(output.instance().getDetails()).toEqual({name: 'TEST_NAME', other: "TEST_VALUE"})
    })

    it('should run Autocomplete methods', () => {
      const output = setup()
      expect(output.find('.search-box').children().node.props.getItemValue('TEST_ITEM')).toBe('TEST_ITEM')
      expect(output.find('.search-box').children().node.props.renderItem().type).toBe('div')
      expect(output.find('.search-box').children().node.props.renderItem('TEST_ITEM', false).props.className).toBe('search-box__option')
      expect(output.find('.search-box').children().node.props.renderItem('TEST_ITEM', true).props.className).toBe('search-box__option search-box__option--highlighted')
    })

  })
})