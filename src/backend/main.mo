import Map "mo:core/Map";
import Bool "mo:core/Bool";
import Text "mo:core/Text";
import Runtime "mo:core/Runtime";
import Principal "mo:core/Principal";
import MixinAuthorization "authorization/MixinAuthorization";
import AccessControl "authorization/access-control";
import UserApproval "user-approval/approval";
import MixinStorage "blob-storage/Mixin";

actor {
  include MixinStorage();

  // Access control state
  let accessControlState = AccessControl.initState();
  include MixinAuthorization(accessControlState);

  // Approval state
  let approvalState = UserApproval.initState(accessControlState);

  // User profile type
  public type UserProfile = {
    name : Text;
    // Add more fields as needed
  };

  // User profiles storage
  let userProfiles = Map.empty<Principal, UserProfile>();

  // User blocks
  let blockedUsers = Map.empty<Principal, Bool>();

  // Approval management functions
  public query ({ caller }) func isCallerApproved() : async Bool {
    if (isCallerBlocked(caller) and not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      return false;
    };

    AccessControl.hasPermission(accessControlState, caller, #admin) or UserApproval.isApproved(approvalState, caller);
  };

  public shared ({ caller }) func requestApproval() : async () {
    if (isCallerBlocked(caller)) {
      Runtime.trap("You are blocked and cannot request approval");
    };

    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can request approval");
    };
    UserApproval.requestApproval(approvalState, caller);
  };

  public shared ({ caller }) func setApproval(user : Principal, status : UserApproval.ApprovalStatus) : async () {
    if (isCallerBlocked(caller)) {
      Runtime.trap("You are blocked and cannot approve users");
    };

    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.setApproval(approvalState, user, status);
  };

  public query ({ caller }) func listApprovals() : async [UserApproval.UserApprovalInfo] {
    if (isCallerBlocked(caller)) {
      Runtime.trap("You are blocked and cannot list approvals");
    };

    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    UserApproval.listApprovals(approvalState);
  };

  // Profile management functions
  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    if (isCallerBlocked(caller)) {
      Runtime.trap("You are blocked and cannot view your profile");
    };

    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can view profiles");
    };

    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    if (isCallerBlocked(caller)) {
      Runtime.trap("You are blocked and cannot view profiles");
    };

    if (not (AccessControl.isAdmin(accessControlState, caller) or caller == user)) {
      Runtime.trap("Unauthorized: Can only view your own profile unless you're admin");
    };

    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    if (isCallerBlocked(caller)) {
      Runtime.trap("You are blocked and cannot save your profile");
    };

    if (not AccessControl.hasPermission(accessControlState, caller, #user)) {
      Runtime.trap("Unauthorized: Only users can update profiles");
    };

    userProfiles.add(caller, profile);
  };

  // Blocking features
  public shared ({ caller }) func blockUser(user: Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    blockedUsers.add(user, true);
  };

  public shared ({ caller }) func unblockUser(user: Principal) : async () {
    if (not AccessControl.hasPermission(accessControlState, caller, #admin)) {
      Runtime.trap("Unauthorized: Only admins can perform this action");
    };
    blockedUsers.remove(user);
  };

  public query ({ caller }) func isUserBlocked(user: Principal) : async Bool {
    not (not blockedUsers.containsKey(user));
  };

  func isCallerBlocked(caller: Principal) : Bool {
    blockedUsers.containsKey(caller);
  };
};
