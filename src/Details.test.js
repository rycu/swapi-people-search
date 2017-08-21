import React from 'react'
import ReactDOM from 'react-dom'
import { shallow, mount } from 'enzyme'
import Details from './Details'

const setup = testProps => {
    const props = Object.assign({
        name: 'TEST_NAME',
        height: '200',
        hair_color: 'blond',
        mass: '75',
        homeworld: 'https://swapi.co/api/test/',
        films: [1,2,3],
        'url': 'https://swapi.co/api/test/'
    }, testProps)  
    const output = mount(<Details {...props}/>)
    return output
}


describe('components', () => {
  describe('Details', () => {
    
    it('renders without crashing', () => {
      const div = document.createElement('div')
      ReactDOM.render(<Details />, div)
    })

    it('formats the data correctly', () => {
      const output = setup()
      expect(output.find('#person-details__height').text()).toEqual('200cm')
      expect(output.find('#person-details__mass').text()).toEqual('75kg')
      expect(output.find('#person-details__homeworld').text()).toEqual('1')
      expect(output.find('#person-details__films').text()).toEqual('3')

      output.setProps({height: 'unknown', mass: 'unknown'})

      expect(output.find('#person-details__height').text()).toEqual('unknown')
      expect(output.find('#person-details__mass').text()).toEqual('unknown')


    })

  })
})