'use strict';

/**
 * A link attribute directive ef-hexadecimal.
 * It will check and restrict user to enter non hexadecimal format characters.
 * <input type="text" ef-hexadecimal ng-model="myNumber" min="0" max="255" digits="2">
 * digits - Number of digits accepted
 */
angular
    .module('ef.directives', [])
    .directive('efHexadecimal', EfHexadecimal);

function EfHexadecimal($browser) {

    return {
        restrict: 'A',
        link: EfHexadecimalLink,
        require: 'ngModel',
        scope: {
            ngModel: '='
        }
    };
    function EfHexadecimalLink($scope, $element, $attrs, ngModel) {

        function digits(value) {
            if (!$attrs.digits || !value) {
                return value;
            }
            var maxLength = parseInt($attrs.digits) + 2;
            if (value.length > maxLength) {
                ngModel.$setViewValue(value.substr(0, maxLength));
                $element.val(value.substr(0, maxLength));
                return value.substr(0, maxLength);
            } else {
                return value;
            }
        }

        function isValid(modelValue, viewValue) {
            var value = parseInt(viewValue, 16);
            return /[0-9a-f]+/i.test(viewValue) && value >= $attrs.min && value <= $attrs.max;
        }

        function deferListener(event) {
            var key = event.keyCode;
            if (key === 91 || (15 < key && key < 19) || (37 <= key && key <= 40)) {
                return;
            }
            $browser.defer(listener);
        }

        function listener() {
            var value = parseInt($element.val(), 16);
            if (value) {
                $element.val('0x' + Number(value).toString(16));
            }
        }

        function parseIntToHex(viewValue) {
            return parseInt(viewValue || 0, 16);
        }

        function render() {
            if (ngModel.$viewValue) {
                $element.val('0x' + Number(ngModel.$viewValue).toString(16));
            }
        }

        ngModel.$formatters.push(digits);
        ngModel.$parsers.push(digits);
        ngModel.$parsers.push(parseIntToHex);
        ngModel.$render = render;
        ngModel.$validators.hexadecimal = isValid;
        $element.bind('change keydown paste cut', deferListener);
        $attrs.$set('placeholder', '0x' + _.repeat('0', parseInt($attrs.digits)));
    }
}
