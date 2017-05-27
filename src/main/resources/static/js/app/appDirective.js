
function directiveUpdatableText($interval){
    return {
        restrict: 'E',
        scope:{
            fCallBack: "&"
        },
        link: function link(scope, element, attrs) {
            var format = 'M/d/yy h:mm:ss a';
            var timeoutId;

            var updateText = function updateText(){
                element.text(scope.fCallBack());
            };

            scope.$watch(attrs.smCurrentTime, function () {
                updateText();
            });

            element.on('$destroy', function () {
                $interval.cancel(timeoutId);
            });

            // start the UI update process; save the timeoutId for canceling
            timeoutId = $interval(function () {
                updateText(); // update DOM
            }, 1000);
        }

    };
}

function directiveCurrentTime($interval, dateFilter) {
    return {
        link: function link(scope, element, attrs) {

            var timeoutId;

            var updateTimer = function() {
                element.text(dateFilter(new Date(), format));
            }

            scope.$watch(attrs.smCurrentTime, function () {
                updateTimer();
            });

            element.on('$destroy', function () {
                $interval.cancel(timeoutId);
            });

            // start the UI update process; save the timeoutId for canceling
            timeoutId = $interval(function () {
                updateTimer(); // update DOM
            }, 1000);
        }

    };
}