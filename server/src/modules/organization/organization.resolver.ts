import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { OrganizationService } from './organization.service';
import { LoginInput } from 'src/graphql/custom/login-input';
import { Organization } from 'src/graphql/@generated/organization/organization.model';
import { OrganizationCreateInput } from 'src/graphql/@generated/organization/organization-create.input';
import { OrganizationUpdateInput } from 'src/graphql/@generated/organization/organization-update.input';
import {
  ChangePasswordInput,
  PasswordInput,
} from 'src/graphql/custom/password-input';
import { SignupResponse } from 'src/graphql/custom/signup-response';
import { EmailInput } from 'src/graphql/custom/email-input';
import { VerifyInput } from 'src/graphql/custom/verify-input';
import { SignupInput } from 'src/graphql/custom/signup-input';

@Resolver(() => Organization)
export class OrganizationResolver {
  constructor(private readonly organizationService: OrganizationService) {}

  @Mutation(() => Organization)
  loginOrganization(@Args('loginInput') loginInput: LoginInput) {
    return this.organizationService.loginOrganization(loginInput);
  }

  @Mutation(() => SignupResponse)
  signupOrganization(@Args('signupInput') signupInput: SignupInput) {
    return this.organizationService.signupOrganization(signupInput);
  }

  @Mutation(() => Organization)
  verifyOrganization(@Args('verifyInput') verifyInput: VerifyInput) {
    return this.organizationService.verifyOrganization(verifyInput);
  }

  @Mutation(() => Organization)
  resetOrganizationPassword(@Args('emailInput') emailInput: EmailInput) {
    return this.organizationService.resetOrganizationPassword(emailInput);
  }
  @Mutation(() => Organization)
  changeOrganizationPassword(
    @Args('token') t: string,
    @Args('passwords') passwords: PasswordInput,
  ) {
    return this.organizationService.changeOrganizationPassword(t, passwords);
  }
  @Mutation(() => SignupResponse)
  resendOrganizationVerify(@Args('token') t: string) {
    return this.organizationService.resendVerifyEmail(t);
  }

  @Mutation(() => Organization)
  createOrganization(
    @Args('createOrganizationInput')
    createOrganizationInput: OrganizationCreateInput,
  ) {
    return this.organizationService.create(createOrganizationInput);
  }

  @Mutation(() => Organization)
  inviteOrganization(
    @Args('createOrganizationInput')
    createOrganizationInput: OrganizationCreateInput,
  ) {
    return this.organizationService.inviteOrganization(createOrganizationInput);
  }

  @Mutation(() => Organization)
  acceptInviteOrganization(
    @Args('Token') token: string,
    @Args('Passwords') passwords: PasswordInput,
  ) {
    return this.organizationService.acceptInvite(token, passwords);
  }

  @Query(() => [Organization], { name: 'organizations' })
  findAll() {
    return this.organizationService.findAll();
  }

  @Query(() => Organization, { name: 'organization' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.organizationService.findOne(id);
  }

  @Mutation(() => Organization)
  updateOrganization(
    @Args('id', { type: () => Int })
    id: number,
    @Args('updateOrganizationInput')
    updateOrganizationInput: OrganizationUpdateInput,
  ) {
    return this.organizationService.update(id, updateOrganizationInput);
  }

  @Mutation(() => Organization)
  removeOrganization(@Args('id', { type: () => Int }) id: number) {
    return this.organizationService.remove(id);
  }

  @Mutation(() => Organization)
  updateTeacherPassword(
    @Args('id', { type: () => Int }) id: number,
    @Args('input') input: ChangePasswordInput,
  ) {
    return this.organizationService.changePassword(id, input);
  }
}
