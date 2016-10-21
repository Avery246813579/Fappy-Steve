Math.toRadians = function(angle){
    return angle * Math.PI / 180;
};

Math.toSign = function(number){
    if(number > 0){
        return 1;
    }

    return -1;
};