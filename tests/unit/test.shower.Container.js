modules.define('test.shower.Container', [
    'shower',
    'shower.Container'
], function (provide, shower, Container) {

    var should = chai.should();

    describe('shower.Container', function () {
    	var containerElement,
    		container; 

    	before(function () {
    		containerElement = document.createElement('div');
    		containerElement.id = 'shower-test-container';

    		document.body.appendChild(containerElement);
    	});

    	after(function () {
    		containerElement.parentNode
    			.removeChild(containerElement);
    	});

    	beforeEach(function () {
    		container = new Container(shower, containerElement);
    	});

    	afterEach(function () {
    		container.destroy();
    	});

        it('Should turn to the slide mode', function () {
        	container.enterSlideMode();
        	document.body
        		.classList.contains('shower--full')
        		.should.eq(true);
        });

        it('Should turn to the list mode', function () {
			var bodyClassList = document.body.classList;
        	
        	container
        		.enterSlideMode()
        		.exitSlideMode();

        	bodyClassList.contains('shower--full')
        		.should.eq(false);

        	bodyClassList.contains('shower--list')
        		.should.eq(true);
        });	

        it('Should return the container element', function () {
        	container.getElement().should.eq(containerElement);
        });
    });

    provide();
});
