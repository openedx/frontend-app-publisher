const courseOptions = {
  data: {
    actions: {
      POST: {
        type: {
          type_options: [
            {
              uuid: '9521aa7d-801b-4a67-92c3-716ea30f5086',
              name: 'Credit',
              course_run_types: [
                {
                  uuid: 'f17e29d6-4648-4bb5-a199-97dc40f904aa',
                  name: 'Credit',
                  modes: ['credit', 'verified', 'audit'],
                  is_marketable: true,
                },
                {
                  uuid: '4e260c57-24ef-46c1-9a0d-5ec3a30f6b0c',
                  name: 'Verified and Audit',
                  modes: ['verified', 'audit'],
                  is_marketable: true,
                },
                {
                  uuid: 'cfacfc62-54bd-4e1b-939a-5a94f12fbd8d',
                  name: 'Audit Only',
                  modes: ['audit'],
                  is_marketable: true,
                },
              ],
              entitlement_types: ['verified'],
              tracks: [
                {
                  seat_type: {
                    name: 'Credit',
                    slug: 'credit',
                  },
                  mode: {
                    name: 'Credit',
                    slug: 'credit',
                    is_id_verified: true,
                    is_credit_eligible: true,
                    certificate_type: 'credit',
                    payee: 'platform',
                  },
                },
                {
                  seat_type: {
                    name: 'Verified',
                    slug: 'verified',
                  },
                  mode: {
                    name: 'Verified',
                    slug: 'verified',
                    is_id_verified: true,
                    is_credit_eligible: false,
                    certificate_type: 'verified',
                    payee: 'platform',
                  },
                },
                {
                  seat_type: {
                    name: 'Audit',
                    slug: 'audit',
                  },
                  mode: {
                    name: 'Audit',
                    slug: 'audit',
                    is_id_verified: false,
                    is_credit_eligible: false,
                    certificate_type: '',
                    payee: '',
                  },
                },
              ],
            },
            {
              uuid: '7b41992e-f268-4331-8ba9-72acb0880454',
              name: 'Masters Only',
              course_run_types: [
                {
                  uuid: 'f394732f-ba43-4260-8ada-06a9f18e7160',
                  name: 'Masters Only',
                  modes: ['masters'],
                  is_marketable: false,
                },
              ],
              entitlement_types: [],
              tracks: [
                {
                  seat_type: null,
                  mode: {
                    name: 'Masters',
                    slug: 'masters',
                    is_id_verified: false,
                    is_credit_eligible: false,
                    certificate_type: '',
                    payee: 'organization',
                  },
                },
              ],
            },
            {
              uuid: '8a8f30e1-23ce-4ed3-a361-1325c656b67b',
              name: 'Verified and Audit',
              course_run_types: [
                {
                  uuid: '4e260c57-24ef-46c1-9a0d-5ec3a30f6b0c',
                  name: 'Verified and Audit',
                  modes: ['verified', 'audit'],
                  is_marketable: true,
                },
                {
                  uuid: 'cfacfc62-54bd-4e1b-939a-5a94f12fbd8d',
                  name: 'Audit Only',
                  modes: ['audit'],
                  is_marketable: true,
                },
              ],
              entitlement_types: ['verified'],
              tracks: [
                {
                  seat_type: {
                    name: 'Verified',
                    slug: 'verified',
                  },
                  mode: {
                    name: 'Verified',
                    slug: 'verified',
                    is_id_verified: true,
                    is_credit_eligible: false,
                    certificate_type: 'verified',
                    payee: 'platform',
                  },
                },
                {
                  seat_type: {
                    name: 'Audit',
                    slug: 'audit',
                  },
                  mode: {
                    name: 'Audit',
                    slug: 'audit',
                    is_id_verified: false,
                    is_credit_eligible: false,
                    certificate_type: '',
                    payee: '',
                  },
                },
              ],
            },
            {
              uuid: 'fdde7d04-7ce0-4ff7-ac90-7f518e90ac1e',
              name: 'Professional Only',
              course_run_types: [
                {
                  uuid: '6cebfc50-abca-4674-b4c7-249b31af6ddb',
                  name: 'Professional Only',
                  modes: ['professional'],
                  is_marketable: true,
                },
              ],
              entitlement_types: ['professional'],
              tracks: [
                {
                  seat_type: {
                    name: 'Professional',
                    slug: 'professional',
                  },
                  mode: {
                    name: 'Professional',
                    slug: 'professional',
                    is_id_verified: true,
                    is_credit_eligible: false,
                    certificate_type: 'professional',
                    payee: 'platform',
                  },
                },
              ],
            },
            {
              uuid: '03e09c15-4127-4031-bc02-e20fcbdf09f0',
              name: 'Audit Only',
              course_run_types: [
                {
                  uuid: 'cfacfc62-54bd-4e1b-939a-5a94f12fbd8d',
                  name: 'Audit Only',
                  modes: ['audit'],
                  is_marketable: true,
                },
              ],
              entitlement_types: ['audit'],
              tracks: [
                {
                  seat_type: {
                    name: 'Audit',
                    slug: 'audit',
                  },
                  mode: {
                    name: 'Audit',
                    slug: 'audit',
                    is_id_verified: false,
                    is_credit_eligible: false,
                    certificate_type: '',
                    payee: '',
                  },
                },
              ],
            },
          ],
        },
        level_type: {
          choices: [
            { display_name: 'Beginner', value: 'beginner' },
            { display_name: 'Intermediate', value: 'intermediate' },
            { display_name: 'Advanced', value: 'advanced' },
          ],
        },
        subjects: {
          child: {
            choices: [
              { display_name: 'Business', value: 'business' },
              { display_name: 'Chemistry', value: 'chemistry' },
              { display_name: 'English', value: 'english' },
              { display_name: 'Security', value: 'security' },
            ],
          },
        },
      },
    },
  },
  isFetching: false,
  error: null,
};

const courseRunOptions = {
  data: {
    actions: {
      POST: {
        pacing_type: {
          type: 'choice',
          required: false,
          read_only: false,
          label: 'Pacing type',
          choices: [{
            display_name: 'Instructor-paced',
            value: 'instructor_paced',
          }, {
            display_name: 'Self-paced',
            value: 'self_paced',
          }],
        },
        content_language: {
          type: 'field',
          required: false,
          read_only: false,
          label: 'Content language',
          help_text: 'Language in which the course is administered',
          choices: [{
            display_name: 'Afrikaans',
            value: 'af',
          }, {
            display_name: 'Arabic - United Arab Emirates',
            value: 'ar-ae',
          }],
        },
        expected_program_type: {
          type: 'field',
          required: false,
          read_only: false,
          label: 'Expected Program Type',
          choices: [{
            display_name: 'Professional Certificate',
            value: 'professional-certificate',
          },
          {
            display_name: 'MicroMasters',
            value: 'micromasters',
          },
          {
            display_name: 'XSeries',
            value: 'xseries',
          },
          {
            display_name: 'Masters',
            value: 'masters',
          }],
        },
      },
    },
  },
  isFetching: false,
  error: null,
};

const collaboratorOptions = {
  data: {
    results: [],
  },
  error: null,
  isFetching: false,
};

export {
  courseOptions,
  courseRunOptions,
  collaboratorOptions,
};
