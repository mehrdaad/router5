import React from 'react';
import { expect } from 'chai';
import { Child, createRouter, FnChild, renderWithRouter } from './utils';
import { RouterProvider, withRoute, routeNode, BaseLink } from '../modules';
import { renderIntoDocument, findRenderedComponentWithType } from 'react-addons-test-utils';
import { spy } from 'sinon';
import listeners from 'router5-listeners';
import { mount } from 'enzyme';

describe('RouterProvider component', () => {
    it('should add the store to the child context', () => {
        const router = createRouter();
        const tree = renderWithRouter(router)(Child);

        const child = findRenderedComponentWithType(tree, Child)
        expect(child.context.router).to.equal(router);
    });
});

describe('withRoute hoc', () => {
    let router;

    before(() => {
        router = createRouter();
    });

    it('should throw an error if router5-listeners plugin is not used', () => {
        const renderTree = () => renderWithRouter(router)(withRoute(() => <div />));
        expect(renderTree).to.throw('[react-router5][withRoute] missing plugin router5-listeners');
    });

    it('should inject the router in the wrapped component props', () => {
        const ChildSpy = spy(FnChild);
        router.usePlugin(listeners());

        const tree = renderWithRouter(router)(withRoute(ChildSpy));
        expect(ChildSpy).to.have.been.calledWith({ router, route: null, previousRoute: null });
    });
});

describe('routeNode hoc', () => {
    let router;

    before(() => {
        router = createRouter();
    });

    it('should throw an error if router5-listeners plugin is not used', () => {
        const renderTree = () => renderWithRouter(router)(routeNode('')(Child));
        expect(renderTree).to.throw('[react-router5][routeNode] missing plugin router5-listeners');
    });

    it('should inject the router in the wrapped component props', () => {
        const ChildSpy = spy(FnChild);
        router.usePlugin(listeners());
        const tree = renderWithRouter(router)(withRoute(ChildSpy));

        expect(ChildSpy).to.have.been.calledWith({ router, route: null, previousRoute: null });
    });
});

describe('BaseLink component', () => {
    let router;

    before(() => {
        router = createRouter();
    });

    it('should render an hyperlink element', () => {
        router.addNode('home', '/home');
        const output = mount(<BaseLink router={ router } routeName={ 'home' } />);
        expect(output.find('a')).to.have.attr('href', '/home')
        expect(output.find('a')).not.to.have.className('active');
    });

    it('should have an active class if associated route is active', () => {
        router.setOption('defaultRoute', 'home');
        router.start();
        const output = mount(<BaseLink router={ router } routeName={ 'home' } />);
        expect(output.find('a')).to.have.className('active');
    });
});
