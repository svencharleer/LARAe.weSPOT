/* ****************************************************************************
 * Copyright (C) 2014 KU Leuven
 * <p/>
 * This library is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Lesser General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 * <p/>
 * This library is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Lesser General Public License for more details.
 * <p/>
 * You should have received a copy of the GNU Lesser General Public License
 * along with this library.  If not, see <http://www.gnu.org/licenses/>.
 * <p/>
 * Contributors: Sven Charleer
 * *************************************************************************** */
var inquiry = require('./inquiry.js');
var user = require('./user.js');
/*
 * GET home page.
 */

exports.userInquiryList = function(req, res){

  inquiry.getInquiriesOfUser(req.params.userAuthId, req.params.userAuthProvider, function(d){
          if(user.users[(req.params.userAuthProvider + "_" + req.params.userAuthId).toLowerCase()] != undefined)
                res.render('userInquiryList.html', {users: user.users, inquiries: d[0].result, userAuthId:req.params.userAuthId, userAuthProvider: req.params.userAuthProvider });
          else
    res.render('noInquiries.html', {users: user.users, inquiries: d[0].result, userAuthId:req.params.userAuthId, userAuthProvider: req.params.userAuthProvider });}
  );
};