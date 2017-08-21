import React from 'react'
import ReactDOM from 'react-dom'
import { shallow, mount } from 'enzyme'
import App from './App'

const setup = () => {
  const output = mount(<App/>)
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

    it('should successfully run getApiData', () => {
      const output = setup()
      output.instance().getApiData("films","https://swapi.co/api", "call")
    })

    it('should successfully run getApiData search', () => {
      const output = setup()
      output.instance().getApiData("people","L", "search")
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