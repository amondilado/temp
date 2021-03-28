$(function() {
    var form = $('#CatalogForm')
        , cpField = $('input[name="cp"]', form)
        , fltsField = $('input[name="flts"]', form)
        , pmmField = $('.range-slider');

    function unique(list) {
        var result = [];
        $.each(list, function(i, e) {
            if ($.inArray(e, result) == -1)
                result.push(e);
        });
        return result;
    }
    function filterProducts(changePage) {
        changePage || (changePage = false);
        if (!changePage) {
            cpField.val(1);
        }
        console.log('fltsField', fltsField.val())
        if (pmmField.data('from') == pmmField.data('min') && pmmField.data('to') == pmmField.data('max')) {
            pmmField.prop('disabled', true);
        }
        // form[0].submit();
    }

    function removeSameGroupItems(fieldValues, groupId) {
        if (!groupId) return;
        const regex = new RegExp('^' + groupId +'_*');
        return fieldValues.filter(function(v) {
            return !regex.test(v)
        });
    }
    pmmField.ionRangeSlider({
        type: "double",
        postprefix: "lt",
        onFinish: function(data) {
            var fieldValue = fltsField.val()
                , fieldValues = fieldValue === '' ? [] : fieldValue.split(',');
            const range = RANGE;
            const rangeMatch = [];
            let minMax = pmmField.val().split(';');

            range.map(function(r) {
                +r.val >= +minMax[0] && +r.val <= +minMax[1] && rangeMatch.push(r.id)
            });

            if (fieldValues.length) {
                fieldValues = removeSameGroupItems(fieldValues, pmmField.data('id'));
            }
            range.length > rangeMatch.length && fieldValues.push.apply(fieldValues, rangeMatch);
            fltsField.val(fieldValues.join(','));
            filterProducts();
        }
    });

    // Update rangeSlider
    if (RANGE && RANGE_SELECTED) {
        const len = RANGE_SELECTED.length;
        let slider = pmmField.data("ionRangeSlider");
        let sliderOptions;

        function sortByVal(a,b) {
            if (+a.val === +b.val) {
                return 0
            }
            return +a.val < +b.val ? -1 : 1;
        }

        RANGE.sort(sortByVal);
        RANGE_SELECTED.sort(sortByVal);

        if (len === 1) {
            const singleVal = RANGE_SELECTED[0].val;
            sliderOptions = {
                from: singleVal,
                to: singleVal,
                min: singleVal,
                max: singleVal
            };
        } else {
            sliderOptions = {
                from: RANGE_SELECTED[0].val,
                to: RANGE_SELECTED[len - 1].val,
                min: RANGE[0].val,
                max: RANGE[RANGE.length - 1].val
            };
        }

        slider.update(sliderOptions);
    }

    $('.filter-item', form).on('click', function(e) {
        e.preventDefault();
        var selected = $(this).hasClass('selected')
            , value = this.hash.substring(1)
            , fieldValue = fltsField.val()
            , fieldValues = fieldValue == '' ? [] : fieldValue.split(',');
        if (!selected) {
            fieldValues.push(value);
        } else {
            fieldValues = $.grep(fieldValues, function(v) {
                return v != value;
            });
        }
        fieldValues = unique(fieldValues);
        fltsField.val(fieldValues.join(','));
        filterProducts();
    });

    $('.filter-select', form).on('change', function(e) {
        e.preventDefault();
        var value = $(this).val()
            , fieldValue = fltsField.val()
            , fieldValues = fieldValue === '' ? [] : fieldValue.split(',');

        if (fieldValues.length) {
            fieldValues = removeSameGroupItems(fieldValues, this.dataset.id);
        }
        value && fieldValues.push(value);
        fltsField.val(fieldValues.join(','));
        filterProducts();
    });

    $('.filter-item-selected').on('click', function(e) {
        e.preventDefault();
        var value = this.hash.substring(1);
        if (value == '0') {
            pmmField.val('');
        } else {
            var fieldValue = fltsField.val()
                , fieldValues = fieldValue.split(',');
            fieldValues = $.grep(fieldValues, function(v) {
                return v != value;
            });
            fieldValues = unique(fieldValues);
            fltsField.val(fieldValues.join(','));
        }
        filterProducts();
    });
    $('.filters-clear').on('click', function(e) {
        e.preventDefault();
        fltsField.val('');
        pmmField.val('');
        filterProducts();
    });
});
$(window).load(function() {
    var form = $('#CatalogForm')
        , fltsField = $('input[name="flts"]', form)
        , qs = decodeURIComponent(window.location.search.substring(1));
    if (qs === '') {
        fltsField.val('');
        return;
    }
    var pairs = qs.split('&'), it;
    if (pairs.length === 1 && pairs[0].indexOf("q=") === 0) {
        fltsField.val('');
        return;
    }
    for (var i = 0, len = pairs.length; i < len; i++) {
        it = pairs[i].split('=');
        $(form[0].elements[it[0]]).val(it[1]);
    }
});
