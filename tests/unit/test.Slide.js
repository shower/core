modules.define('test.Slide', [
    'shower',
    'Slide'
], function (provide, shower, Slide) {

    var should = chai.should();

    describe('Slide', function () {
        var slide;

        beforeEach(function () {
            slide = new Slide('test test');
        });

        afterEach(function () {
            slide.destroy();
            slide = null;
        });

        it('Should create new slide with content', function () {
            new Slide('test test');
        });

        it('Should create new slide from element', function () {
            var slideElement = document.createElement('div');
            document.body.appendChild(slideElement);

            new Slide(slideElement);

            slideElement.parentNode.removeChild(slideElement);
        });

        it('Should fire event and change visited state after activate', function (done) {
            slide.events.once('activate', function () {
                slide.state.visited.should.eq(1);
                done();
            });

            slide.activate();
        });

        it('Should fire event after deactivate', function (done) {
            slide.activate();

            slide.events.once('deactivate', function () {
                done();
            });

            slide.deactivate();
        });

        it('Should not be active after create', function () {
            slide.isActive().should.eq(false);
        });

        it('Should be active after activate', function () {
            slide.activate();
            slide.isActive().should.eq(true);
        });

        it('Should not be visited after create', function () {
            slide.isVisited().should.eq(false);
        });

        it('Should not be visited after activate', function () {
            slide.activate();
            slide.isVisited().should.eq(true);
        });

        it('Should auto init layout after create', function () {
            var layout = slide.getLayout();
            (typeof layout).should.not.eq('undefined');
        });
    });

    provide();
});
