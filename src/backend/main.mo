import Map "mo:core/Map";
import Nat "mo:core/Nat";
import Iter "mo:core/Iter";
import Text "mo:core/Text";
import Array "mo:core/Array";
import Time "mo:core/Time";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Order "mo:core/Order";
import Principal "mo:core/Principal";

import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";


actor {
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // User Profile Type
  public type UserProfile = {
    name : Text;
  };

  let userProfiles = Map.empty<Principal, UserProfile>();

  // User Profile Management Functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can access profiles");
    };
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (caller != user and not AccessControl.isAdmin(accessControlState, caller)) {
      Runtime.trap("Unauthorized: Can only view your own profile");
    };
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can save profiles");
    };
    userProfiles.add(caller, profile);
  };

  // Blog Post Types
  type Post = {
    id : Nat;
    title : Text;
    body : Text;
    category : Category;
    coverImageUrl : ?Text;
    createdAt : Time.Time;
    authorName : Text;
  };

  type Category = {
    #clothes;
    #phone_accessories;
    #fashion;
    #technology;
  };

  type PostInput = {
    title : Text;
    body : Text;
    category : Category;
    coverImageUrl : ?Text;
    authorName : Text;
  };

  var nextPostId = 1;
  let posts = Map.empty<Nat, Post>();

  // Blog Post Functions
  public shared ({ caller }) func createPost(input : PostInput) : async Nat {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can create posts");
    };

    let post : Post = {
      id = nextPostId;
      title = input.title;
      body = input.body;
      category = input.category;
      coverImageUrl = input.coverImageUrl;
      createdAt = Time.now();
      authorName = input.authorName;
    };

    posts.add(nextPostId, post);
    nextPostId += 1;
    post.id;
  };

  public query func getPost(id : Nat) : async ?Post {
    posts.get(id);
  };

  public shared ({ caller }) func updatePost(id : Nat, input : PostInput) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can update posts");
    };

    switch (posts.get(id)) {
      case (null) { Runtime.trap("Post not found") };
      case (?existingPost) {
        let updatedPost : Post = {
          id = existingPost.id;
          title = input.title;
          body = input.body;
          category = input.category;
          coverImageUrl = input.coverImageUrl;
          createdAt = existingPost.createdAt;
          authorName = input.authorName;
        };
        posts.add(id, updatedPost);
      };
    };
  };

  public shared ({ caller }) func deletePost(id : Nat) : async () {
    if (not (AccessControl.isAdmin(accessControlState, caller))) {
      Runtime.trap("Unauthorized: Only admins can delete posts");
    };

    if (not posts.containsKey(id)) {
      Runtime.trap("Post not found");
    };

    posts.remove(id);
  };

  public query func getAllPosts() : async [Post] {
    posts.values().toArray();
  };

  public query func getPostsByCategory(category : Category) : async [Post] {
    posts.values().toArray().filter(func(post) { post.category == category });
  };

  // Score System
  type Score = {
    playerName : Text;
    score : Nat;
  };

  module Score {
    public func compare(a : Score, b : Score) : Order.Order {
      if (a.score > b.score) { #less } else if (a.score < b.score) {
        #greater;
      } else {
        Text.compare(a.playerName, b.playerName);
      };
    };
  };

  let scoresList = List.empty<Score>();

  public query func getTopScores() : async [Score] {
    scoresList.toArray().sort().sliceToArray(0, Nat.min(10, scoresList.size()));
  };

  public shared ({ caller }) func addScore(playerName : Text, score : Nat) : async () {
    if (not (AccessControl.hasPermission(accessControlState, caller, #user))) {
      Runtime.trap("Unauthorized: Only users can add scores");
    };

    if (playerName.isEmpty()) {
      Runtime.trap("Player name cannot be empty");
    };

    let newScore : Score = {
      playerName;
      score;
    };

    scoresList.add(newScore);
  };
};
